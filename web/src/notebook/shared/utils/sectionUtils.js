export const kidsOf = (s) => s.children || s.subSections || [];

export function findSectionById(sections, id) {
  for (const s of sections) {
    if (s.id === id) return s;
    const found = findSectionById(kidsOf(s), id);
    if (found) return found;
  }
  return null;
}

export function findParentAndOrder(sections, afterId) {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].id === afterId) return { parentId: null, orderIndex: i + 1 };
    const found = findParentAndOrderInList(kidsOf(sections[i]), afterId, sections[i].id);
    if (found) return found;
  }
  return null;
}

function findParentAndOrderInList(list, afterId, parentId) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === afterId) return { parentId, orderIndex: i + 1 };
    const found = findParentAndOrderInList(kidsOf(list[i]), afterId, parentId);
    if (found) return found;
  }
  return null;
}

export function countChildren(sections, parentId) {
  if (parentId == null) return sections.length;
  for (const s of sections) {
    if (s.id === parentId) return (s.children || s.subSections || []).length;
    const n = countChildren(kidsOf(s), parentId);
    if (n >= 0) return n;
  }
  return -1;
}

export function insertAfterInList(list, afterId, newSection) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === afterId) {
      const next = [...list];
      next.splice(i + 1, 0, { ...newSection, children: newSection.children ?? [] });
      return next;
    }
    const inChild = insertAfterInList(kidsOf(list[i]), afterId, newSection);
    if (inChild !== null) {
      return list.map((s, j) => (j === i ? { ...s, children: inChild } : s));
    }
  }
  return null;
}

export function appendChildToParent(list, parentId, newSection) {
  return list.map((s) => {
    if (s.id === parentId) {
      return { ...s, children: [...kidsOf(s), { ...newSection, children: newSection.children ?? [] }] };
    }
    return { ...s, children: appendChildToParent(kidsOf(s), parentId, newSection) };
  });
}

export function replaceInList(list, tempId, replacement) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === tempId) {
      const next = [...list];
      next[i] = normalizeSection(replacement);
      return next;
    }
    const inChild = replaceInList(kidsOf(list[i]), tempId, replacement);
    if (inChild !== null) {
      return list.map((s, j) => (j === i ? { ...s, children: inChild } : s));
    }
  }
  return null;
}

export function normalizeSection(s) {
  if (!s) return s;
  const children = (s.subSections ?? s.children ?? []).map(normalizeSection);
  const { subSections, ...rest } = s;
  return { ...rest, children };
}

export function moveSection(list, draggedId, targetId) {
  const newList = JSON.parse(JSON.stringify(list));
  let draggedSection = null;

  const removeFromTree = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === draggedId) {
        draggedSection = nodes.splice(i, 1)[0];
        return true;
      }
      if (nodes[i].children && removeFromTree(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  removeFromTree(newList);
  if (!draggedSection) return list;

  const insertAfterTarget = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === targetId) {
        nodes.splice(i + 1, 0, draggedSection);
        return true;
      }
      if (nodes[i].children && insertAfterTarget(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  if (insertAfterTarget(newList)) {
    return newList;
  }

  return list;
}

export function moveSectionBefore(list, draggedId, targetId) {
  const newList = JSON.parse(JSON.stringify(list));
  let draggedSection = null;

  const removeFromTree = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === draggedId) {
        draggedSection = nodes.splice(i, 1)[0];
        return true;
      }
      if (nodes[i].children && removeFromTree(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  removeFromTree(newList);
  if (!draggedSection) return list;

  const insertBeforeTarget = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === targetId) {
        nodes.splice(i, 0, draggedSection);
        return true;
      }
      if (nodes[i].children && insertBeforeTarget(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  if (insertBeforeTarget(newList)) {
    return newList;
  }

  return list;
}

export function moveSectionInto(list, draggedId, targetId) {
  const newList = JSON.parse(JSON.stringify(list));
  let draggedSection = null;

  const removeFromTree = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === draggedId) {
        draggedSection = nodes.splice(i, 1)[0];
        return true;
      }
      if (nodes[i].children && removeFromTree(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  removeFromTree(newList);
  if (!draggedSection) return list;

  const insertIntoTarget = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === targetId) {
        if (!nodes[i].children) nodes[i].children = [];
        nodes[i].children.push(draggedSection);
        return true;
      }
      if (nodes[i].children && insertIntoTarget(nodes[i].children)) {
        return true;
      }
    }
    return false;
  };

  if (insertIntoTarget(newList)) {
    return newList;
  }

  return list;
}
